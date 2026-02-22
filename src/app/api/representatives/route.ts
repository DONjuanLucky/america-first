import { NextResponse } from "next/server";

type Official = {
  name: string;
  role: string;
  party?: string;
  phone?: string;
  website?: string;
};

type ZipPlace = {
  [key: string]: string | undefined;
  state?: string;
  longitude?: string;
  latitude?: string;
};

const zipRegex = /^\d{5}$/;

export async function GET(request: Request) {
  const zip = new URL(request.url).searchParams.get("zip")?.trim() ?? "";

  if (!zipRegex.test(zip)) {
    return NextResponse.json({ error: "Invalid ZIP code." }, { status: 400 });
  }

  const fromGoogle = await lookupWithGoogleCivic(zip);
  if (fromGoogle.data) {
    return NextResponse.json(fromGoogle.data);
  }

  const fallback = await lookupWithGovTrackFallback(zip, fromGoogle.reason);
  return NextResponse.json(fallback);
}

async function lookupWithGoogleCivic(zip: string) {
  const key = process.env.GOOGLE_CIVIC_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    return { data: null as null, reason: "GOOGLE_CIVIC_API_KEY is not configured." };
  }

  const url = new URL("https://civicinfo.googleapis.com/civicinfo/v2/representatives");
  url.searchParams.set("address", zip);
  url.searchParams.set("key", key);

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      const payload = await response.text();
      return { data: null as null, reason: `Google Civic API error ${response.status}: ${payload.slice(0, 120)}` };
    }

    const data = (await response.json()) as {
      normalizedInput?: { city?: string; state?: string; zip?: string };
      officials?: Array<{ name?: string; party?: string; phones?: string[]; urls?: string[] }>;
      offices?: Array<{ name?: string; officialIndices?: number[] }>;
      divisions?: Record<string, { name?: string }>;
    };

    const officials: Official[] = [];
    for (const office of data.offices ?? []) {
      for (const index of office.officialIndices ?? []) {
        const person = data.officials?.[index];
        if (!person?.name || !office.name) {
          continue;
        }
        officials.push({
          name: person.name,
          role: office.name,
          party: person.party,
          phone: person.phones?.[0],
          website: person.urls?.[0],
        });
      }
    }

    const region = `${data.normalizedInput?.city ?? ""}, ${data.normalizedInput?.state ?? ""} ${data.normalizedInput?.zip ?? zip}`.trim();

    return { data: {
      zip,
      region,
      method: "google-civic",
      officials,
      updatedAt: new Date().toISOString(),
    } };
  } catch {
    return { data: null as null, reason: "Google Civic API request failed." };
  }
}

async function lookupWithGovTrackFallback(zip: string, googleReason?: string) {
  const zipResponse = await fetch(`https://api.zippopotam.us/us/${zip}`, { cache: "no-store" });
  if (!zipResponse.ok) {
    return {
      zip,
      region: "Unknown",
      method: "fallback",
      officials: [],
      updatedAt: new Date().toISOString(),
    };
  }

  const zipData = (await zipResponse.json()) as {
    places?: ZipPlace[];
  };
  const place = zipData.places?.[0];
  const stateCode = place?.["state abbreviation"];
  const stateName = place?.state;
  const city = place?.["place name"];
  const longitude = Number(place?.longitude ?? "");
  const latitude = Number(place?.latitude ?? "");

  const officials: Official[] = [];

  const district =
    Number.isFinite(latitude) && Number.isFinite(longitude)
      ? await lookupCongressionalDistrict(latitude, longitude)
      : null;

  if (stateCode) {
    const [senatorsResponse, representativesResponse] = await Promise.all([
      fetch(`https://www.govtrack.us/api/v2/role?current=true&role_type=senator&state=${stateCode}`, { cache: "no-store" }),
      fetch(
        district
          ? `https://www.govtrack.us/api/v2/role?current=true&role_type=representative&state=${stateCode}&district=${district}`
          : `https://www.govtrack.us/api/v2/role?current=true&role_type=representative&state=${stateCode}`,
        { cache: "no-store" },
      ),
    ]);

    if (senatorsResponse.ok) {
      const senators = (await senatorsResponse.json()) as {
        objects?: Array<{ person?: { name?: string }; title_long?: string; party?: string; phone?: string; website?: string }>;
      };
      for (const item of senators.objects ?? []) {
        if (!item.person?.name) {
          continue;
        }
        officials.push({
          name: item.person.name,
          role: item.title_long ?? "U.S. Senator",
          party: item.party,
          phone: item.phone,
          website: item.website,
        });
      }
    }

    if (representativesResponse.ok) {
      const reps = (await representativesResponse.json()) as {
        objects?: Array<{
          person?: { name?: string };
          description?: string;
          district?: number;
          party?: string;
          phone?: string;
          website?: string;
        }>;
      };

      for (const item of (reps.objects ?? []).slice(0, district ? 2 : 6)) {
        if (!item.person?.name) {
          continue;
        }
        officials.push({
          name: item.person.name,
          role: item.description ?? `U.S. Representative (District ${item.district ?? "?"})`,
          party: item.party,
          phone: item.phone,
          website: item.website,
        });
      }
    }
  }

  return {
    zip,
    region: `${city ?? ""}, ${stateName ?? ""}`.trim(),
    method: "govtrack-fallback",
    officials,
    updatedAt: new Date().toISOString(),
    note:
      "District-precise matching is strongest with Google Civic API enabled. Fallback returns current federal officials for your state." +
      (district ? ` Census geocoder mapped district ${district}.` : "") +
      (googleReason ? ` Google Civic status: ${googleReason}` : ""),
  };
}

async function lookupCongressionalDistrict(latitude: number, longitude: number) {
  try {
    const url = new URL("https://geocoding.geo.census.gov/geocoder/geographies/coordinates");
    url.searchParams.set("x", String(longitude));
    url.searchParams.set("y", String(latitude));
    url.searchParams.set("benchmark", "Public_AR_Current");
    url.searchParams.set("vintage", "Current_Current");
    url.searchParams.set("format", "json");

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      result?: {
        geographies?: {
          [key: string]: Array<{ CD119?: string; STATE?: string }>;
        };
      };
    };

    const districtRows = data.result?.geographies?.["119th Congressional Districts"];
    const row = districtRows?.[0];
    return row?.CD119 ?? null;
  } catch {
    return null;
  }
}

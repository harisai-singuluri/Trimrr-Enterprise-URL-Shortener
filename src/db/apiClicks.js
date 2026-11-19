import {UAParser} from "ua-parser-js";
import {apiClient} from "./apiClient";

const parser = new UAParser();

export async function getClicksForUrls(urlIds) {
  if (!urlIds || urlIds.length === 0) return [];

  const idsParam = urlIds.join(",");
  const clicks = await apiClient(`/clicks/urls?ids=${idsParam}`, {
    method: "GET",
  });

  return (clicks || []).map(click => ({
    id: click.id,
    url_id: click.urlId,
    city: click.city,
    country: click.country,
    device: click.device,
    browser: click.browser,
    os: click.os,
    referrer: click.referrer,
    created_at: click.createdAt,
  }));
}

export async function getClicksForUrl(url_id) {
  const clicks = await apiClient(`/clicks/url/${url_id}`, {
    method: "GET",
  });

  return (clicks || []).map(click => ({
    id: click.id,
    url_id: click.urlId,
    city: click.city,
    country: click.country,
    device: click.device,
    browser: click.browser,
    os: click.os,
    referrer: click.referrer,
    created_at: click.createdAt,
  }));
}

export const storeClicks = async ({id, originalUrl}) => {
  try {
    const res = parser.getResult();
    const device = res.device?.type || (window.innerWidth < 768 ? "mobile" : "desktop");
    const browser = res.browser?.name || "Unknown";
    const os = res.os?.name || "Unknown";

    // Non-blocking background click logging
    apiClient("/clicks", {
      method: "POST",
      body: {
        urlId: id,
        city: "Localhost",
        country: "Localhost",
        device,
        browser,
        os,
        referrer: document.referrer || "Direct",
      },
    }).catch(err => console.error("Click logging non-blocking error:", err));

    // Ensure absolute destination URL (prevents relative path misdirection)
    let destination = originalUrl;
    if (destination && !destination.startsWith("http://") && !destination.startsWith("https://")) {
      destination = `https://${destination}`;
    }

    // Redirect user to destination immediately
    window.location.href = destination;
  } catch (error) {
    console.error("Error redirecting:", error);
    let destination = originalUrl;
    if (destination && !destination.startsWith("http://") && !destination.startsWith("https://")) {
      destination = `https://${destination}`;
    }
    window.location.href = destination;
  }
};

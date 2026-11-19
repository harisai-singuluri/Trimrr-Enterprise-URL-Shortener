import {apiClient} from "./apiClient";

export async function getUrls() {
  const urls = await apiClient("/urls", {
    method: "GET",
  });

  return (urls || []).map(url => ({
    id: url.id,
    title: url.title,
    original_url: url.originalUrl,
    short_url: url.shortUrl,
    custom_url: url.customUrl,
    qr: url.qrCode,
    qr_fg_color: url.qrForegroundColor || "#0F172A",
    qr_bg_color: url.qrBackgroundColor || "#FFFFFF",
    expires_at: url.expiresAt,
    is_active: url.isActive,
    click_count: url.clickCount,
    max_clicks: url.maxClicks,
    has_password: url.hasPassword,
    is_expired: url.isExpired,
    created_at: url.createdAt,
  }));
}

export async function getUrl({id}) {
  const url = await apiClient(`/urls/${id}`, {
    method: "GET",
  });

  return {
    id: url.id,
    title: url.title,
    original_url: url.originalUrl,
    short_url: url.shortUrl,
    custom_url: url.customUrl,
    qr: url.qrCode,
    qr_fg_color: url.qrForegroundColor || "#0F172A",
    qr_bg_color: url.qrBackgroundColor || "#FFFFFF",
    expires_at: url.expiresAt,
    is_active: url.isActive,
    click_count: url.clickCount,
    max_clicks: url.maxClicks,
    has_password: url.hasPassword,
    is_expired: url.isExpired,
    created_at: url.createdAt,
  };
}

export async function getLongUrl(id) {
  const url = await apiClient(`/urls/resolve/${id}`, {
    method: "GET",
  });

  return {
    id: url.id,
    original_url: url.originalUrl,
    title: url.title,
    has_password: url.hasPassword,
    is_expired: url.isExpired,
    is_active: url.isActive,
  };
}

export async function createUrl({title, longUrl, customUrl, expiresAt, password, maxClicks, qrForegroundColor, qrBackgroundColor}) {
  const url = await apiClient("/urls", {
    method: "POST",
    body: {
      title,
      originalUrl: longUrl,
      customUrl: customUrl || null,
      expiresAt: expiresAt || null,
      password: password || null,
      maxClicks: maxClicks ? parseInt(maxClicks, 10) : null,
      qrForegroundColor: qrForegroundColor || "#0F172A",
      qrBackgroundColor: qrBackgroundColor || "#FFFFFF",
    },
  });

  return [{
    id: url.id,
    title: url.title,
    original_url: url.originalUrl,
    short_url: url.shortUrl,
    custom_url: url.customUrl,
    qr: url.qrCode,
    qr_fg_color: url.qrForegroundColor,
    qr_bg_color: url.qrBackgroundColor,
    expires_at: url.expiresAt,
    is_active: url.isActive,
    click_count: url.clickCount,
    max_clicks: url.maxClicks,
    has_password: url.hasPassword,
    is_expired: url.isExpired,
    created_at: url.createdAt,
  }];
}

export async function unlockUrl({code, password}) {
  return await apiClient(`/urls/unlock/${code}`, {
    method: "POST",
    body: {password},
  });
}

export async function previewQr({text, fgColor, bgColor}) {
  const params = new URLSearchParams({
    text: text || "https://example.com",
    fgColor: fgColor || "#0F172A",
    bgColor: bgColor || "#FFFFFF",
  });
  const data = await apiClient(`/urls/preview-qr?${params.toString()}`, {
    method: "GET",
  });
  return data?.qrCode;
}

export async function deleteUrl(id) {
  await apiClient(`/urls/${id}`, {
    method: "DELETE",
  });
  return id;
}

export async function toggleUrlStatus({id, isActive}) {
  const url = await apiClient(`/urls/${id}/status?isActive=${isActive}`, {
    method: "PUT",
  });

  return {
    id: url.id,
    title: url.title,
    original_url: url.originalUrl,
    short_url: url.shortUrl,
    custom_url: url.customUrl,
    qr: url.qrCode,
    expires_at: url.expiresAt,
    is_active: url.isActive,
    click_count: url.clickCount,
    max_clicks: url.maxClicks,
    has_password: url.hasPassword,
    is_expired: url.isExpired,
    created_at: url.createdAt,
  };
}

function getOptimizedBannerUrl(bannerUrl, width) {
  if (!bannerUrl) {
    return '';
  }

  try {
    const url = new URL(bannerUrl);
    url.searchParams.set('auto', 'compress');
    url.searchParams.set('cs', 'tinysrgb');
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('w', String(width));

    return url.toString();
  } catch {
    return bannerUrl;
  }
}

module.exports = {
  getOptimizedBannerUrl,
};
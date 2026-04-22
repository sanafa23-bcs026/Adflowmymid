let ads = [];

export const createAd = (data) => {
  const newAd = {
    id: Date.now(),
    title: data.title,
  };
  ads.push(newAd);
  return newAd;
};

export const getAds = () => {
  return ads;
};
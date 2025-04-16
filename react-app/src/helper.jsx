const domain = 'http://localhost/api/';

export const storage = () => {
    const storage = domain.replace('api', 'storage/');
    return storage;
};

export const imageUrl = (url) => {
    if (url == null) {
        return '/assets/img/not-found.webp';
    } else if (url.startsWith('http:') || url.startsWith('https:') || url.startsWith('blob:')) {
        return url;
    } else {
        return storage() + url;
    }
}

export const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), wait);
    };
};

export default {
    imageUrl,
    debounce
}

export const getYouTubeVideoId = (url) => {
    const regExp = /(?:youtube\.com\/(?:.*v=|embed\/|v\/|shorts\/)|youtu\.be\/)([^"&?\/\s]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
};


export const shouldShowBadge = (video) => {
    if (!video?.created_at || !video?.package) return false;

    const createdAt = new Date(video.created_at);
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const isWithinOneMonth = createdAt >= oneMonthAgo;
    const isPromotedOrPremium = video.package === 3 || video.package === 4;

    return isWithinOneMonth && isPromotedOrPremium;
};

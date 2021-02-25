export function stringFromTime(timestamp, short = false) {
    const date = new Date(timestamp.seconds * 1000);
    const dateNow = new Date();

    const seconds = Math.floor((dateNow - date) / 1000);

    const options = {
        year: 'numeric', month: 'long', day: 'numeric',
    };

    let interval = seconds / 604800.02;

    // Previous year then return date and if short return weeks
    if (dateNow.getFullYear() !== date.getFullYear()) {
        if (short) return `${Math.floor(interval)}w`;
        return date.toLocaleDateString(undefined, options);
    }

    // >1 week ago then return day + month & if short return weeks
    interval = seconds / 604800.02;
    if (interval > 1) {
        delete options.year;
        if (short) return `${Math.floor(interval)}w`;
        return date.toLocaleDateString(undefined, options);
    }

    // Return days
    interval = seconds / 86400;
    if (interval > 1) {
        if (short) return `${Math.floor(interval)}d`;
        if (interval > 2) return `${Math.floor(interval)} days ago`;
        return `${Math.floor(interval)} day ago`;
    }
    // Return hours
    interval = seconds / 3600;
    if (interval > 1) {
        if (short) return `${Math.floor(interval)}h`;
        if (interval > 2) return `${Math.floor(interval)} hours ago`;
        return `${Math.floor(interval)} hour ago`;
    }
    // Return minutes
    interval = seconds / 60;
    if (interval > 1) {
        if (short) return `${Math.floor(interval)}m`;
        if (interval > 2) return `${Math.floor(interval)} minutes ago`;
        return `${Math.floor(interval)} minute ago`;
    }
    // Return seconds
    if (short) return `${Math.floor(seconds)}s`;
    if (interval > 2) return `${Math.floor(interval)} seconds ago`;
    return `${Math.floor(interval)} second ago`;
}

// Pairs user IDs together
export function pairUID(fromUID, toUID) {
    return [fromUID, toUID].sort().join('_').toString();
}

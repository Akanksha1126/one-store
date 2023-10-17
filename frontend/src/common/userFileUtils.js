export function compareFileUpdateTime(a,b){
    if(a.updateTimestamp < b.updateTimestamp){
        return -1;
    }
    return 1;
}


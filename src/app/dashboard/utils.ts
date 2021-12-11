
// implemented for fun. you can actually use the bufferCount of rxjs
export function splitToBatches(items: any[]) {
    const splited: Array<any[]> = new Array<any[]>();
    const batchSize = 5;

    for (let i = 0; i < items.length; i+=batchSize) {
      splited[i] = [];
      for (let j = 0; j < batchSize; j++) {
        const nextItem = items[i + j];
        if (!!nextItem) {
          splited[i].push(nextItem);
        }
      }
    }

    return splited.filter(i => !!i);
}
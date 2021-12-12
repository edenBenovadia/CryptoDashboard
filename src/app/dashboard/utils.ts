
// implemented for fun. you can actually use the bufferCount of rxjs
export function splitToBatches(items: any[], batchSize: number): Array<any[]> {
    const splited: Array<any[]> = new Array<any[]>();

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

export function roundNumber(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}
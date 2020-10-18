export const generateColor = (number: number) => {
  let n = (number * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
};

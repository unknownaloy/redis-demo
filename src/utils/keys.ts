export const getKeyName = (...args: string[]) => {
  return `bites:${args.join(":")}`;
};

export const restaurantKeyById = (id: string) => getKeyName("restaurant", id);
 
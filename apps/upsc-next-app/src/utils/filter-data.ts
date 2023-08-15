export default function filterData(data: any, substring: string) {
  const filtered: any[] = [];
  for (const category of data.categories) {
    // if the value is in l1, keep the whole l1 and continue
    for (const l1 of Array.from(Object.keys(category))) {
      const selectedL2s: any = {};
      if (l1.toLowerCase().includes(substring.toLowerCase())) {
        filtered.push({ l1: category[l1] });
        continue;
      } else {
        Object.keys(category[l1]).forEach((l2: string) => {
          if (l2.toLowerCase().includes(substring.toLowerCase())) {
            selectedL2s[l2] = [];
          }
        });
        if (Object.keys(selectedL2s).length > 0) {
          filtered.push({ l1: selectedL2s });
        }
      }
    }
  }
  return { categories: filtered };
}

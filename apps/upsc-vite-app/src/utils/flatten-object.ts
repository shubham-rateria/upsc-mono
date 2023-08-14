export default function flattenObject(obj: any) {
    const result: any[] = [];
  
    function extractLeafValues(obj: any) {
      if (typeof obj === "object" && obj !== null) {
        if (Array.isArray(obj)) {
          obj.forEach((item) => extractLeafValues(item));
        } else {
          for (const key in obj) {
            result.push(key);
            extractLeafValues(obj[key]);
          }
        }
      } else {
        result.push(obj);
      }
    }
  
    extractLeafValues(obj);
    return result;
  }
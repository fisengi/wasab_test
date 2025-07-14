export default async function fetchData<T>(
    url: string,
    options?: RequestInit,
  ): Promise<T> {
    const response = await fetch(url, options);
    const responseData = await response.json();
  
    if (response.ok) {
      return responseData;
    } else {
      throw new Error(responseData.message || "Unknown Error");
    }
  }
  
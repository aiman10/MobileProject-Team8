import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchCurrencies = async () => {
  const cacheKey = "currenciesData";
  const lastFetchKey = "lastFetchCurrencies";

  try {
    const lastFetch = await AsyncStorage.getItem(lastFetchKey);
    const isDataOld =
      Date.now() - new Date(lastFetch).getTime() > 24 * 60 * 60 * 1000;

    if (lastFetch && !isDataOld) {
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    }

    const response = await axios.get(
      "https://v6.exchangerate-api.com/v6/1b9fae45b46e8783d8a00c5b/codes"
    );
    if (response.data && response.data.supported_codes) {
      const currencyData = response.data.supported_codes.map((code) => ({
        label: `${code[0]} - ${code[1]}`,
        value: code[0],
      }));

      // Update cache
      await AsyncStorage.setItem(cacheKey, JSON.stringify(currencyData));
      await AsyncStorage.setItem(lastFetchKey, new Date().toISOString());

      return currencyData;
    }
  } catch (error) {
    console.error("Error fetching currencies", error);
  }
};

export const fetchConversionRate = async (fromCurrency, toCurrency) => {
  // console.log("fromCurrency", fromCurrency);
  // console.log("toCurrency", toCurrency);
  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/1b9fae45b46e8783d8a00c5b/pair/${fromCurrency}/${toCurrency}`
    );
    if (response.data && response.data.conversion_rate) {
      return response.data.conversion_rate;
    } else {
      throw new Error("Conversion rate data is not available");
    }
  } catch (error) {
    console.error("Error fetching conversion rate", error);
    return null;
  }
};

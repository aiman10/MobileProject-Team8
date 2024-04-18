import axios from "axios";

export const fetchCurrencies = async () => {
  try {
    const response = await axios.get(
      "https://v6.exchangerate-api.com/v6/62b142d42c6ca5a45e7944f1/codes"
    );
    if (response.data && response.data.supported_codes) {
      const currencyData = response.data.supported_codes.map((code) => ({
        label: `${code[0]} - ${code[1]}`,
        //label: `${code[0]}`,
        value: code[0],
      }));
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
      `https://v6.exchangerate-api.com/v6/62b142d42c6ca5a45e7944f1/pair/${fromCurrency}/${toCurrency}`
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

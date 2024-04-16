import axios from "axios";

export const fetchCurrencies = async () => {
  try {
    const response = await axios.get(
      "https://v6.exchangerate-api.com/v6/62b142d42c6ca5a45e7944f1/codes"
    );
    if (response.data && response.data.supported_codes) {
      const currencyData = response.data.supported_codes.map((code) => ({
        // label: `${code[0]} - ${code[1]}`,
        label: `${code[0]}`,
        value: code[0],
      }));
      return currencyData;
    }
  } catch (error) {
    console.error("Error fetching currencies", error);
  }
};

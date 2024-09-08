import { Image } from "react-native"
import AIRTELMONEY from "../../assets/AirtelMoney.png"
import MTNMOMO from "../../assets/MtnMoMo.png"
import PESAPAL from "../../assets/pesapal.png"

export const PAYMENT_OPTIONS = [
  {
    label: "MTN MOMO",
    value: "mtnmomo",
    comingSoon: false,
    logo: Image.resolveAssetSource(MTNMOMO).uri,
  },
  {
    label: "Airtel Money",
    value: "airtelmoney",
    comingSoon: true,
    logo: Image.resolveAssetSource(AIRTELMONEY).uri,
  },
  {
    label: "Visa | Mastercard",
    value: "pesapal",
    comingSoon: true,
    logo: Image.resolveAssetSource(PESAPAL).uri,
  },
]

// Subscription plans
export const SUBSCRIPTION_PLANS = [
  {
    label: "Monthly",
    value: "monthly",
    price: 1530,
    currency: "UGX", // Ugandan Shilling
    selected: false,
  },
  {
    label: "Weekly",
    value: "weekly",
    price: 100,
    currency: "UGX",
    selected: false,
  },
]

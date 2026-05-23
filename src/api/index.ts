import axios from "axios";

import { BaseUrl } from "@/config";

const api = axios.create({
  baseURL: BaseUrl,
  timeout: 30000,
});

export default api;

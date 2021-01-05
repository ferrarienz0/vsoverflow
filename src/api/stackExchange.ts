import axios from "axios";

import { IStackResponse, Item } from "./ts/IStackExchangeApi";

export async function getRelevantQuestions(
  questionOrBug: string,
  languageWebsite: string
): Promise<Item[]> {
  const optionsURL = "https://api.stackexchange.com/2.2/search/advanced";

  const { data }: { data: IStackResponse } = await axios.get(optionsURL, {
    params: {
      order: "desc",
      sort: "relevance",
      site: languageWebsite,
      q: questionOrBug,
    },
  });

  const { items } = data;

  return items.filter((item) => item.is_answered);
}

export async function getQuestionPageHTML(href: string): Promise<string> {
  const { data: htmlContent } = await axios.get(href);

  return htmlContent;
}

export type PersonalizationProfile = {
  role: "SSP" | "SE" | "CSA";
  plays: Array<"MIGRATE_MODERNIZE" | "UNIFY_DATA_PLATFORM" | "AI_APPS_AGENTS">;
};

export type ContentBlock = {
  type:
    | "HeroBlock"
    | "CTAButtonRow"
    | "TopicGridBlock"
    | "DashboardGridBlock"
    | "OfferFinderBlock"
    | "QuoteBlock"
    | "ChecklistBlock"
    | "FAQBlock"
    | "NowShippingStrip"
    | "AgendaBlock"
    | "LeadershipBlock";
  order: number;
};

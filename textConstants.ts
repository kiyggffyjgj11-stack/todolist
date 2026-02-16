
export const UI_TEXT = {
    // Start Screen
    START_BUTTON: "はじめる",

    // Navigation / Headers
    APP_TITLE_OMNI_SCANNER: "検索",
    APP_TITLE_STAR_ATLAS: "図鑑",
    APP_TITLE_MISSION_TERMINAL: "記録",
    APP_TITLE_SECTORS_ARCHIVE: "アーカイブ",

    // Search / Inputs
    SEARCH_PLACEHOLDER: "タスクを検索...",
    NEW_TASK_PLACEHOLDER: "タスクを追加...",
    NEW_SECTOR_TITLE: "New Sector",
    NEW_SECTOR_PLACEHOLDER: "リストを追加",

    // Buttons / Actions
    BUTTON_ABORT: "とじる",
    BUTTON_CONNECT: "完了",
    BUTTON_RESTORE: "Restore",
    BUTTON_RESUME_MISSION: "拡大",

    // Labels / Status
    LABEL_SECTOR: "Sector:",
    LABEL_COLLECTED: "Collected",
    LABEL_LOCKED: "Locked",
    LABEL_MONTHLY_COMPLETION: "月間達成数",
    LABEL_TOTAL_COMPLETION: "年間達成数",
    LABEL_LOG_PREFIX: "ログ:",
    LABEL_NO_RECORDS: "No records found",
    LABEL_DISCOVERED_IN_SECTOR: "Discovered stars in this sector",

    // Dynamic formatters (functions)
    formatCollectedCount: (current: number, total: number) => `${current} / ${total} Collected`,
    formatSectorLog: (label: string | undefined, timeString: string) => `${label} • ${timeString}`,
};

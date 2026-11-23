use tauri_plugin_sql::{Migration, MigrationKind};

/// Ordered, append-only list of user.db migrations. Never edit a shipped migration;
/// add a new one instead so existing user data is upgraded in place.
fn user_db_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "init settings and activity",
            sql: include_str!("../migrations/0001_init.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "lesson progress",
            sql: include_str!("../migrations/0002_progress.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "search history and favorites",
            sql: include_str!("../migrations/0003_search.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "personal data collections",
            sql: include_str!("../migrations/0004_items.sql"),
            kind: MigrationKind::Up,
        },
    ]
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:user.db", user_db_migrations())
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running CODEVERSE");
}

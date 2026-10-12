//! Application logic. This crate must not depend on Tauri, so it can be tested and reused on its own.

/// Builds the greeting shown on the start screen.
pub fn greet(name: &str) -> String {
    let name = name.trim();
    if name.is_empty() {
        "Hello!".to_owned()
    } else {
        format!("Hello, {name}!")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn greets_by_name() {
        assert_eq!(greet("Ada"), "Hello, Ada!");
    }

    #[test]
    fn falls_back_without_a_name() {
        assert_eq!(greet("   "), "Hello!");
    }
}

import Foundation

struct Mission: Codable, Identifiable {
    let id: String
    let title: String
    let status: String
}

struct AttentionItem: Codable, Identifiable {
    let id: String
    let prompt: String
    let status: String
}

struct ChatMessage: Codable, Identifiable {
    let id: String
    let role: String
    let content: String
    let createdAt: Date
}

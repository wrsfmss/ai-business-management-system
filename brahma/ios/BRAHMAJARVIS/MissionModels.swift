import Foundation

struct Mission: Identifiable, Codable {
    let id: UUID
    let title: String
    let status: String
    let updatedAt: Date
}

struct AttentionItem: Identifiable, Codable {
    let id: UUID
    let executionID: UUID
    let prompt: String
    let status: String
    let createdAt: Date
}

struct ChatMessage: Identifiable, Codable {
    let id: UUID
    let role: String
    let content: String
    let createdAt: Date
}

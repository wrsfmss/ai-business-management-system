import Foundation

struct AttentionAction: Encodable {
    let decision: String
    let idempotencyKey: String
}

@MainActor
final class AttentionActions: ObservableObject {
    @Published private(set) var errorMessage: String?
    @Published private(set) var submitting = false

    private let client: APIClient
    private let tokenProvider: () throws -> String

    init(client: APIClient, tokenProvider: @escaping () throws -> String) {
        self.client = client
        self.tokenProvider = tokenProvider
    }

    func decide(requestID: String, decision: String) async {
        submitting = true
        defer { submitting = false }
        do {
            let token = try tokenProvider()
            let key = UUID().uuidString
            let body = try JSONEncoder().encode(AttentionAction(decision: decision, idempotencyKey: key))
            let _: [String: String] = try await client.request(
                "api/v1/attention/\(requestID)/decision",
                token: token,
                method: "POST",
                body: body
            )
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

import Foundation

@MainActor
final class AttentionViewModel: ObservableObject {
    @Published private(set) var items: [AttentionItem] = []
    @Published private(set) var errorMessage: String?

    private let client: APIClient
    private let tokenProvider: () throws -> String

    init(client: APIClient, tokenProvider: @escaping () throws -> String) {
        self.client = client
        self.tokenProvider = tokenProvider
    }

    func refresh() async {
        do {
            let token = try tokenProvider()
            items = try await client.request("api/v1/attention", token: token)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

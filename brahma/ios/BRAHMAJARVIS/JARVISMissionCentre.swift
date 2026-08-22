import SwiftUI

struct JARVISMissionCentre: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            NavigationStack { Text("Chat") }
                .tabItem { Label("Chat", systemImage: "message") }
                .tag(0)

            NavigationStack { Text("Missions") }
                .tabItem { Label("Missions", systemImage: "checklist") }
                .tag(1)

            NavigationStack { Text("Needs You") }
                .tabItem { Label("Needs You", systemImage: "hand.raised") }
                .tag(2)

            NavigationStack { Text("Activity") }
                .tabItem { Label("Activity", systemImage: "clock.arrow.circlepath") }
                .tag(3)

            NavigationStack { Text("Memory") }
                .tabItem { Label("Memory", systemImage: "brain") }
                .tag(4)
        }
    }
}

#Preview {
    JARVISMissionCentre()
}

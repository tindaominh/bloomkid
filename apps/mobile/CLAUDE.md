# Mobile App Context

Expo + React Native + TypeScript. Target: iOS 16+ and Android 10+.

## Key Folders
- `src/screens/`      One file per screen, named `<Name>Screen.tsx`
- `src/components/`   Shared UI components, one folder per component
- `src/navigation/`   React Navigation stack/tab definitions
- `src/services/`     API client, audio player, storage helpers
- `src/store/`        Zustand stores (lesson progress, settings)
- `src/types/`        Mobile-only types (re-export from @bloomkid/shared where possible)
- `src/constants/`    Colors, spacing, font sizes, API base URL

## Screens
- `HomeScreen`         Category grid (Animals, Colors, Family…)
- `FlashcardScreen`    Flashcard swiper with audio + image
- `QuizScreen`         Touch & Find game
- `ParentDashboard`    Progress charts (behind parental gate)

## Rules
- No inline styles — use `StyleSheet.create`
- Touch targets minimum 44×44 logical pixels
- All audio via `src/services/audio.ts` (wraps expo-av)
- Never store user data in AsyncStorage without encryption

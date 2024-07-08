import { Stack } from 'expo-router';

export default function MenuScreen() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title:"Menu"}} />
        </Stack>
    );
};
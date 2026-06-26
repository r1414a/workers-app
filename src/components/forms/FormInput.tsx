// src/components/ui/FormInput.tsx

import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { Text, TextInput, View } from "react-native";

interface Props {
  label: string;
  name: string;
  control: Control<any>;
  error?: string;
  keyboardType?: any;
}
type FormInputProps<T extends FieldValues> = {
  label: string;
  control: Control<T>;
  name: Path<T>;
  placeholder: string;
  error?: string;
  keyboardType?: any;
};

export function FormInput<T extends FieldValues>({
  label,
  name,
  control,
  placeholder,
  error,
  keyboardType,
}: FormInputProps<T>) {
  return (
    <View className="mt-4">
      <Text className="mb-2 font-medium">{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            keyboardType={keyboardType}
            placeholder={placeholder}
            className="rounded-xl border border-gray-300 p-4"
          />
        )}
      />

      {error && <Text className="mt-1 text-red-500">{error}</Text>}
    </View>
  );
}

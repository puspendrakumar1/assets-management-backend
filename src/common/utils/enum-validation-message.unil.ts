export function enumValidatorMessage(enumValues: any, field: string) {
  return `Only [${(
    Object.keys(enumValues) as Array<keyof typeof enumValues>
  ).map((key) => enumValues[key])}] values are allowed for ${field}`;
}

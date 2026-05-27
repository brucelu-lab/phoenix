import { getLocalTimeZone } from "@internationalized/date";
import { useMemo } from "react";

import {
  Card,
  ComboBox,
  ComboBoxItem,
  Flex,
  Icon,
  Icons,
  Text,
  View,
} from "@phoenix/components";
import {
  isProviderThemeMode,
  usePreferencesContext,
  useTheme,
} from "@phoenix/contexts";
import type { DisplayTimezone } from "@phoenix/store/preferencesStore";
import { packageManagersByLanguage } from "@phoenix/store/preferencesStore";
import {
  isProgrammingLanguage,
  isPythonPackageManager,
  isTypescriptPackageManager,
  programmingLanguages,
} from "@phoenix/types/code";
import { getTimeZoneShortName } from "@phoenix/utils/timeFormatUtils";
import { getLocale, getSupportedTimezones } from "@phoenix/utils/timeUtils";

export function ViewerPreferences() {
  const { systemTheme, themeMode, setThemeMode } = useTheme();
  const {
    displayTimezone,
    setDisplayTimezone,
    programmingLanguage,
    setProgrammingLanguage,
    pythonPackageManager,
    typescriptPackageManager,
    setPackageManager,
  } = usePreferencesContext((state) => ({
    displayTimezone: state.displayTimezone,
    setDisplayTimezone: state.setDisplayTimezone,
    programmingLanguage: state.programmingLanguage,
    setProgrammingLanguage: state.setProgrammingLanguage,
    pythonPackageManager: state.packageManagerByLanguage["Python"],
    typescriptPackageManager: state.packageManagerByLanguage["TypeScript"],
    setPackageManager: state.setPackageManager,
  }));

  const themeOptions = useMemo(() => {
    return [
      {
        id: "system" as const,
        label: `Auto (${systemTheme})`,
        icon: <Icons.HalfMoonHalfSunOutline />,
      },
      {
        id: "dark" as const,
        label: "Dark",
        icon: <Icons.MoonOutline />,
      },
      {
        id: "light" as const,
        label: "Light",
        icon: <Icons.SunOutline />,
      },
    ];
  }, [systemTheme]);

  const timeZoneOptions = useMemo(() => {
    const supportedTimezones = [...getSupportedTimezones()];
    const locale = getLocale();
    // Sort the timezones so that UTC is first
    supportedTimezones.sort((a, b) => {
      if (a === "UTC") return -1;
      if (b === "UTC") return 1;
      return 0;
    });
    return [
      {
        value: "local" as const,
        label: `Local (${getLocalTimeZone()})`,
      },
      ...supportedTimezones.map((timezone) => ({
        value: timezone,
        label: `${timezone} (${getTimeZoneShortName({ locale, timeZone: timezone })})`,
      })),
    ];
  }, []);

  const selectedTimezone = displayTimezone ?? "local";
  return (
    <Card title="偏好">
      <View padding="size-200">
        <Flex direction="column" gap="size-200">
          <ComboBox
            aria-label="主题"
            label="主题"
            description="选择应用的颜色主题"
            selectedKey={themeMode}
            onSelectionChange={(value) => {
              if (value && isProviderThemeMode(value)) {
                setThemeMode(value);
              }
            }}
          >
            {themeOptions.map((option) => (
              <ComboBoxItem
                key={option.id}
                id={option.id}
                textValue={option.label}
              >
                <Flex direction="row" gap="size-100" alignItems="center">
                  <Icon svg={option.icon} />
                  <Text weight="heavy">{option.label}</Text>
                </Flex>
              </ComboBoxItem>
            ))}
          </ComboBox>
          <ComboBox
            aria-label="显示时区"
            label="时区"
            description="选择整个应用中时间戳的显示方式"
            placeholder="搜索时区..."
            selectedKey={selectedTimezone}
            onSelectionChange={(value) => {
              if (value === "local") {
                setDisplayTimezone(undefined);
              } else {
                setDisplayTimezone(value as DisplayTimezone);
              }
            }}
          >
            {timeZoneOptions.map((option) => (
              <ComboBoxItem
                key={option.value}
                id={option.value}
                textValue={option.label}
              >
                <Flex direction="column" gap="size-50">
                  <Text weight="heavy">{option.label}</Text>
                </Flex>
              </ComboBoxItem>
            ))}
          </ComboBox>
          <ComboBox
            aria-label="编程语言"
            label="编程语言"
            description="选择代码片段的默认语言"
            selectedKey={programmingLanguage}
            onSelectionChange={(value) => {
              if (value && isProgrammingLanguage(value)) {
                setProgrammingLanguage(value);
              }
            }}
          >
            {programmingLanguages.map((lang) => (
              <ComboBoxItem key={lang} id={lang} textValue={lang}>
                <Text weight="heavy">{lang}</Text>
              </ComboBoxItem>
            ))}
          </ComboBox>
          <ComboBox
            aria-label="Python 包管理器"
            label="Python 包管理器"
            description="选择 Python 安装命令的默认包管理器"
            selectedKey={pythonPackageManager}
            onSelectionChange={(value) => {
              if (value && isPythonPackageManager(value)) {
                setPackageManager("Python", value);
              }
            }}
          >
            {packageManagersByLanguage["Python"].map((pm) => (
              <ComboBoxItem key={pm} id={pm} textValue={pm}>
                <Text weight="heavy">{pm}</Text>
              </ComboBoxItem>
            ))}
          </ComboBox>
          <ComboBox
            aria-label="TypeScript 包管理器"
            label="TypeScript 包管理器"
            description="选择 TypeScript 安装命令的默认包管理器"
            selectedKey={typescriptPackageManager}
            onSelectionChange={(value) => {
              if (value && isTypescriptPackageManager(value)) {
                setPackageManager("TypeScript", value);
              }
            }}
          >
            {packageManagersByLanguage["TypeScript"].map((pm) => (
              <ComboBoxItem key={pm} id={pm} textValue={pm}>
                <Text weight="heavy">{pm}</Text>
              </ComboBoxItem>
            ))}
          </ComboBox>
        </Flex>
      </View>
    </Card>
  );
}

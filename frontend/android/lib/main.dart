import 'package:flutter/material.dart';
import 'package:flutter_quill/flutter_quill.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';

import 'providers/auth_provider.dart';
import 'providers/theme_provider.dart';
import 'providers/language_provider.dart';
import 'providers/form_provider.dart';
import 'providers/response_provider.dart';

import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/user_home_screen.dart';
import 'screens/scan_form_screen.dart';

import 'l10n/app_localizations.dart';

void main() {
  runApp(const FormMakerApp());
}

class FormMakerApp extends StatelessWidget {
  const FormMakerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => LanguageProvider()),
        ChangeNotifierProvider(create: (_) => FormProvider()),
        ChangeNotifierProvider(create: (_) => ResponseProvider()),
      ],
      child: Consumer2<ThemeProvider, LanguageProvider>(
        builder: (context, themeProvider, languageProvider, _) {
          return MaterialApp(
            title: 'HiDocs!',
            debugShowCheckedModeBanner: false,

            localizationsDelegates: const [
              ...GlobalMaterialLocalizations.delegates,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
              FlutterQuillLocalizations.delegate,
              ...AppLocalizations.localizationsDelegates,
            ],

            supportedLocales: AppLocalizations.supportedLocales,
            locale: languageProvider.locale,

            theme: themeProvider.buildLightTheme(),
            darkTheme: themeProvider.buildDarkTheme(),
            themeMode: themeProvider.themeMode,

            builder: (context, child) {
              return child!;
            },

            home: const AuthWrapper(),

            routes: {
              '/login': (context) => const LoginScreen(),
              '/register': (context) => const RegisterScreen(),
              '/user-home': (context) => const UserHomeScreen(),
              '/scan-form': (context) => const ScanFormScreen(),
            },
          );
        },
      ),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    if (auth.isLoggedIn) {
      return const UserHomeScreen();
    }

    return const LoginScreen();
  }
}

class ThemeBackground extends StatelessWidget {
  final Widget child;

  const ThemeBackground({
    required this.child,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();

    if (!themeProvider.hasThemeImage ||
        themeProvider.themeImageBytes == null) {
      return child;
    }

    return Stack(
      children: [
        Positioned.fill(
          child: Image.memory(
            themeProvider.themeImageBytes!,
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) {
              return ColoredBox(
                color: themeProvider.primary,
                child: const SizedBox.expand(),
              );
            },
          ),
        ),
        Positioned.fill(
          child: ColoredBox(
            color: Colors.black.withValues(alpha: 0.45),
          ),
        ),
        child,
      ],
    );
  }
}
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dotech_provider/core/globals.dart';
import 'package:dotech_provider/features/jobs/presentation/pages/job_detail_page.dart';
import 'package:dotech_provider/injection_container/injection_container.dart'
    as di;
import 'package:dotech_provider/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:dotech_provider/features/onboarding/presentation/bloc/onboarding_bloc.dart';
import 'package:dotech_provider/features/jobs/presentation/bloc/jobs_bloc.dart';
import 'package:dotech_provider/features/auth/presentation/pages/login_page.dart';

import 'package:dotech_provider/core/services/notification_service.dart';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  await di.init();

  // Initialize Notifications
  final notificationService = di.sl<NotificationService>();
  await notificationService.init();

  runApp(const ProviderApp());
}

class ProviderApp extends StatelessWidget {
  const ProviderApp({super.key});

  @override
  Widget build(BuildContext context) {

    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => di.sl<AuthBloc>()),
        BlocProvider(create: (_) => di.sl<OnboardingBloc>()),
        BlocProvider(create: (_) => di.sl<JobsBloc>()),
      ],
      child: MaterialApp(
        navigatorKey: navigatorKey,
        title: 'Dotech Provider',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primarySwatch: Colors.teal,
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
        ),
        home: const LoginPage(),
        routes: {
             '/job_detail': (context) => JobDetailPage(
                  jobId: ModalRoute.of(context)!.settings.arguments as String,
             ),
        },
      ),
    );
  }
}

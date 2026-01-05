import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dotech_customer/injection_container/injection_container.dart'
    as di;
import 'package:dotech_customer/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:dotech_customer/features/discovery/presentation/bloc/discovery_bloc.dart';
import 'package:dotech_customer/features/booking/presentation/bloc/booking_bloc.dart';
import 'package:dotech_customer/features/auth/presentation/pages/login_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await di.init();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => di.sl<AuthBloc>()),
        BlocProvider(create: (_) => di.sl<DiscoveryBloc>()),
        BlocProvider(create: (_) => di.sl<BookingBloc>()),
      ],
      child: MaterialApp(
        title: 'Dotech Customer',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primarySwatch: Colors.indigo,
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        ),
        home: const LoginPage(),
      ),
    );
  }
}

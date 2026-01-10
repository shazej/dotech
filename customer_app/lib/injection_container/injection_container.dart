import 'dart:io';
import 'package:get_it/get_it.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../core/network/auth_interceptor.dart';

// Auth
import '../features/auth/data/datasources/auth_remote_data_source.dart';
import '../features/auth/data/repositories/auth_repository_impl.dart';
import '../features/auth/domain/repositories/auth_repository.dart';
import '../features/auth/domain/usecases/send_otp.dart';
import '../features/auth/domain/usecases/verify_otp.dart';
import '../features/auth/presentation/bloc/auth_bloc.dart';

// Discovery
import '../features/discovery/data/datasources/discovery_remote_data_source.dart';
import '../features/discovery/data/repositories/discovery_repository_impl.dart';
import '../features/discovery/domain/repositories/discovery_repository.dart';
import '../features/discovery/domain/usecases/get_services.dart';
import '../features/discovery/presentation/bloc/discovery_bloc.dart';

// Booking
import '../features/booking/data/datasources/booking_remote_data_source.dart';
import '../features/booking/data/repositories/booking_repository_impl.dart';
import '../features/booking/domain/repositories/booking_repository.dart';
import '../features/booking/domain/usecases/create_booking.dart';
import '../features/booking/presentation/bloc/booking_bloc.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // Features - Auth
  sl.registerFactory(
    () => AuthBloc(sendOtpUseCase: sl(), verifyOtpUseCase: sl()),
  );
  sl.registerLazySingleton(() => SendOtp(sl()));
  sl.registerLazySingleton(() => VerifyOtp(sl()));
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(remoteDataSource: sl()),
  );
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(dio: sl(), storage: sl()),
  );

  // Features - Discovery
  sl.registerFactory(() => DiscoveryBloc(getServicesUseCase: sl()));
  sl.registerLazySingleton(() => GetServices(sl()));
  sl.registerLazySingleton<DiscoveryRepository>(
    () => DiscoveryRepositoryImpl(remoteDataSource: sl()),
  );
  sl.registerLazySingleton<DiscoveryRemoteDataSource>(
    () => DiscoveryRemoteDataSourceImpl(dio: sl()),
  );

  // Features - Booking
  sl.registerFactory(() => BookingBloc(createBookingUseCase: sl()));
  sl.registerLazySingleton(() => CreateBooking(sl()));
  sl.registerLazySingleton<BookingRepository>(
    () => BookingRepositoryImpl(remoteDataSource: sl()),
  );
  sl.registerLazySingleton<BookingRemoteDataSource>(
    () => BookingRemoteDataSourceImpl(dio: sl()),
  );

  // External
  sl.registerLazySingleton(() {
    // Deterministic Base URL Resolution
    // Android Emulator uses 10.0.2.2 to access host localhost
    // iOS Simulator uses localhost
    final baseUrl = Platform.isAndroid 
        ? 'http://10.0.2.2:3000' 
        : 'http://localhost:3000';

    final dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 5),
        receiveTimeout: const Duration(seconds: 3),
      ),
    );
    // Auth Interceptor
    dio.interceptors.add(sl<AuthInterceptor>());
    return dio;
  });

  // Storage
  sl.registerLazySingleton(() => const FlutterSecureStorage());
  sl.registerLazySingleton(() => AuthInterceptor(sl()));
}

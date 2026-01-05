import 'package:get_it/get_it.dart';
import 'package:dio/dio.dart';

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
    () => AuthRemoteDataSourceImpl(dio: sl()),
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
    final dio = Dio(
      BaseOptions(
        baseUrl: 'http://localhost:3000',
        connectTimeout: const Duration(seconds: 5),
        receiveTimeout: const Duration(seconds: 3),
      ),
    );
    // TODO: Add AuthInterceptor for JWT
    return dio;
  });
}

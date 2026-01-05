import 'package:get_it/get_it.dart';
import 'package:dio/dio.dart';

// Auth
import '../features/auth/data/datasources/auth_remote_data_source.dart';
import '../features/auth/data/repositories/auth_repository_impl.dart';
import '../features/auth/domain/repositories/auth_repository.dart';
import '../features/auth/domain/usecases/send_otp.dart';
import '../features/auth/domain/usecases/verify_otp.dart';
import '../features/auth/presentation/bloc/auth_bloc.dart';

// Onboarding
import '../features/onboarding/data/datasources/onboarding_remote_data_source.dart';
import '../features/onboarding/data/repositories/onboarding_repository_impl.dart';
import '../features/onboarding/domain/repositories/onboarding_repository.dart';
import '../features/onboarding/domain/usecases/update_profile.dart';
import '../features/onboarding/presentation/bloc/onboarding_bloc.dart';

// Jobs
import '../features/jobs/data/datasources/jobs_remote_data_source.dart';
import '../features/jobs/data/repositories/jobs_repository_impl.dart';
import '../features/jobs/domain/repositories/jobs_repository.dart';
import '../features/jobs/domain/usecases/get_my_jobs.dart';
import '../features/jobs/domain/usecases/update_job_status.dart';
import '../features/jobs/presentation/bloc/jobs_bloc.dart';

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

  // Features - Onboarding
  sl.registerFactory(() => OnboardingBloc(updateProfileUseCase: sl()));
  sl.registerLazySingleton(() => UpdateProfile(sl()));
  sl.registerLazySingleton<OnboardingRepository>(
    () => OnboardingRepositoryImpl(remoteDataSource: sl()),
  );
  sl.registerLazySingleton<OnboardingRemoteDataSource>(
    () => OnboardingRemoteDataSourceImpl(dio: sl()),
  );

  // Features - Jobs
  sl.registerFactory(
    () => JobsBloc(getMyJobsUseCase: sl(), updateJobStatusUseCase: sl()),
  );
  sl.registerLazySingleton(() => GetMyJobs(sl()));
  sl.registerLazySingleton(() => UpdateJobStatus(sl()));
  sl.registerLazySingleton<JobsRepository>(
    () => JobsRepositoryImpl(remoteDataSource: sl()),
  );
  sl.registerLazySingleton<JobsRemoteDataSource>(
    () => JobsRemoteDataSourceImpl(dio: sl()),
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
    return dio;
  });
}

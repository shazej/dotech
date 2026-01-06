import 'package:dartz/dartz.dart';
import 'package:dotech_provider/core/error/failures.dart';
import 'package:dotech_provider/features/onboarding/domain/entities/provider_profile.dart';
import 'package:dotech_provider/features/onboarding/domain/repositories/onboarding_repository.dart';
import '../datasources/onboarding_remote_data_source.dart';

class OnboardingRepositoryImpl implements OnboardingRepository {
  final OnboardingRemoteDataSource remoteDataSource;

  OnboardingRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, ProviderProfile>> updateProfile({
    required String bio,
    required List<String> skills,
  }) async {
    try {
      final profile = await remoteDataSource.updateProfile(
        bio: bio,
        skills: skills,
      );
      return Right(profile);
    } catch (e) {
      if (e is Failure) return Left(e);
      return const Left(ServerFailure(message: 'Onboarding Server Error'));
    }
  }

  @override
  Future<Either<Failure, ProviderProfile>> getProfile() async {
    try {
      final profile = await remoteDataSource.getProfile();
      return Right(profile);
    } catch (e) {
      if (e is Failure) return Left(e);
      return const Left(ServerFailure(message: 'Failed to fetch profile'));
    }
  }
}

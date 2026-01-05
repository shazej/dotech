import 'package:dartz/dartz.dart';
import 'package:dotech_provider/core/error/failures.dart';
import '../entities/provider_profile.dart';

abstract class OnboardingRepository {
  Future<Either<Failure, ProviderProfile>> updateProfile({
    required String bio,
    required List<String> skills,
  });
  Future<Either<Failure, ProviderProfile>> getProfile();
}

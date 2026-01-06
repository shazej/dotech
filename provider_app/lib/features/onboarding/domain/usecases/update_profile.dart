import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:dotech_provider/core/error/failures.dart';
import 'package:dotech_provider/core/usecases/usecase.dart';
import '../entities/provider_profile.dart';
import '../repositories/onboarding_repository.dart';

class UpdateProfile implements UseCase<ProviderProfile, UpdateProfileParams> {
  final OnboardingRepository repository;

  UpdateProfile(this.repository);

  @override
  Future<Either<Failure, ProviderProfile>> call(
    UpdateProfileParams params,
  ) async {
    return await repository.updateProfile(
      bio: params.bio,
      skills: params.skills,
    );
  }
}

class UpdateProfileParams extends Equatable {
  final String bio;
  final List<String> skills;

  const UpdateProfileParams({required this.bio, required this.skills});

  @override
  List<Object> get props => [bio, skills];
}

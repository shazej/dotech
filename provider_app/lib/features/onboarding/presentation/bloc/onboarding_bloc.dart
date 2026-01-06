import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:dotech_provider/features/onboarding/domain/entities/provider_profile.dart';
import 'package:dotech_provider/features/onboarding/domain/usecases/update_profile.dart';

abstract class OnboardingEvent extends Equatable {
  const OnboardingEvent();
  @override
  List<Object?> get props => [];
}

class UpdateProviderProfileEvent extends OnboardingEvent {
  final String bio;
  final List<String> skills;

  const UpdateProviderProfileEvent({required this.bio, required this.skills});

  @override
  List<Object?> get props => [bio, skills];
}

abstract class OnboardingState extends Equatable {
  const OnboardingState();
  @override
  List<Object?> get props => [];
}

class OnboardingInitial extends OnboardingState {}

class OnboardingLoading extends OnboardingState {}

class OnboardingCompleted extends OnboardingState {
  final ProviderProfile profile;
  const OnboardingCompleted(this.profile);
  @override
  List<Object?> get props => [profile];
}

class OnboardingError extends OnboardingState {
  final String message;
  const OnboardingError(this.message);
  @override
  List<Object?> get props => [message];
}

class OnboardingBloc extends Bloc<OnboardingEvent, OnboardingState> {
  final UpdateProfile updateProfileUseCase;

  OnboardingBloc({required this.updateProfileUseCase})
    : super(OnboardingInitial()) {
    on<UpdateProviderProfileEvent>((event, emit) async {
      emit(OnboardingLoading());
      final result = await updateProfileUseCase(
        UpdateProfileParams(bio: event.bio, skills: event.skills),
      );
      result.fold(
        (failure) => emit(OnboardingError(failure.message)),
        (profile) => emit(OnboardingCompleted(profile)),
      );
    });
  }
}

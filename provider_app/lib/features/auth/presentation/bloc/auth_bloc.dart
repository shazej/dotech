import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:dotech_provider/features/auth/domain/entities/user.dart';
import 'package:dotech_provider/features/auth/domain/usecases/send_otp.dart';
import 'package:dotech_provider/features/auth/domain/usecases/verify_otp.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();
  @override
  List<Object?> get props => [];
}

class SendOtpEvent extends AuthEvent {
  final String phone;
  const SendOtpEvent(this.phone);
  @override
  List<Object?> get props => [phone];
}

class VerifyOtpEvent extends AuthEvent {
  final String phone;
  final String otp;
  const VerifyOtpEvent({required this.phone, required this.otp});
  @override
  List<Object?> get props => [phone, otp];
}

abstract class AuthState extends Equatable {
  const AuthState();
  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class OtpSentState extends AuthState {
  final String message;
  const OtpSentState(this.message);
  @override
  List<Object?> get props => [message];
}

class Authenticated extends AuthState {
  final User user;
  const Authenticated(this.user);
  @override
  List<Object?> get props => [user];
}

class AuthError extends AuthState {
  final String message;
  const AuthError(this.message);
  @override
  List<Object?> get props => [message];
}

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final SendOtp sendOtpUseCase;
  final VerifyOtp verifyOtpUseCase;

  AuthBloc({required this.sendOtpUseCase, required this.verifyOtpUseCase})
    : super(AuthInitial()) {
    on<SendOtpEvent>((event, emit) async {
      emit(AuthLoading());
      final result = await sendOtpUseCase(event.phone);
      result.fold(
        (failure) => emit(AuthError(failure.message)),
        (message) => emit(OtpSentState(message)),
      );
    });

    on<VerifyOtpEvent>((event, emit) async {
      emit(AuthLoading());
      final result = await verifyOtpUseCase(
        VerifyOtpParams(phone: event.phone, otp: event.otp),
      );
      result.fold(
        (failure) => emit(AuthError(failure.message)),
        (user) => emit(Authenticated(user)),
      );
    });
  }
}

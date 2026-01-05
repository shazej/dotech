import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/usecases/send_otp.dart';
import '../../domain/usecases/verify_otp.dart';
import 'auth_event.dart';
import 'auth_state.dart';

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

    on<LogoutEvent>((event, emit) {
      emit(AuthInitial());
    });
  }
}

import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:dotech_provider/core/error/failures.dart';
import 'package:dotech_provider/core/usecases/usecase.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class VerifyOtp implements UseCase<User, VerifyOtpParams> {
  final AuthRepository repository;

  VerifyOtp(this.repository);

  @override
  Future<Either<Failure, User>> call(VerifyOtpParams params) async {
    return await repository.verifyOtp(params.phone, params.otp);
  }
}

class VerifyOtpParams extends Equatable {
  final String phone;
  final String otp;

  const VerifyOtpParams({required this.phone, required this.otp});

  @override
  List<Object> get props => [phone, otp];
}

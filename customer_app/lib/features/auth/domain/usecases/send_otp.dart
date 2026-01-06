import 'package:dartz/dartz.dart';
import 'package:dotech_customer/core/error/failures.dart';
import 'package:dotech_customer/core/usecases/usecase.dart';
import 'package:dotech_customer/features/auth/domain/repositories/auth_repository.dart';

class SendOtp implements UseCase<String, String> {
  final AuthRepository repository;

  SendOtp(this.repository);

  @override
  Future<Either<Failure, String>> call(String phone) async {
    return await repository.sendOtp(phone);
  }
}

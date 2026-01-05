import 'package:dartz/dartz.dart';
import 'package:dotech_customer/core/error/failures.dart';
import 'package:dotech_customer/core/usecases/usecase.dart';
import '../entities/service.dart';
import '../repositories/discovery_repository.dart';

class GetServices implements UseCase<List<Service>, String?> {
  final DiscoveryRepository repository;

  GetServices(this.repository);

  @override
  Future<Either<Failure, List<Service>>> call(String? categoryId) async {
    return await repository.getServices(categoryId);
  }
}

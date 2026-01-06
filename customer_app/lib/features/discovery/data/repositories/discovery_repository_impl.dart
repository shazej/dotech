import 'package:dartz/dartz.dart';
import 'package:dotech_customer/core/error/failures.dart';
import 'package:dotech_customer/features/discovery/domain/entities/service.dart';
import 'package:dotech_customer/features/discovery/domain/repositories/discovery_repository.dart';
import '../datasources/discovery_remote_data_source.dart';

class DiscoveryRepositoryImpl implements DiscoveryRepository {
  final DiscoveryRemoteDataSource remoteDataSource;

  DiscoveryRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, List<Service>>> getServices(String? categoryId) async {
    try {
      final services = await remoteDataSource.getServices(categoryId);
      return Right(services);
    } catch (e) {
      if (e is Failure) return Left(e);
      return const Left(ServerFailure(message: 'Discovery Server Error'));
    }
  }
}

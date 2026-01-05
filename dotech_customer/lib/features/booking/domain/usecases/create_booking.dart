import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:dotech_customer/core/error/failures.dart';
import 'package:dotech_customer/core/usecases/usecase.dart';
import '../entities/booking.dart';
import '../repositories/booking_repository.dart';

class CreateBooking implements UseCase<Booking, CreateBookingParams> {
  final BookingRepository repository;

  CreateBooking(this.repository);

  @override
  Future<Either<Failure, Booking>> call(CreateBookingParams params) async {
    return await repository.createBooking(
      serviceId: params.serviceId,
      scheduledAt: params.scheduledAt,
      addressId: params.addressId,
    );
  }
}

class CreateBookingParams extends Equatable {
  final String serviceId;
  final DateTime scheduledAt;
  final String addressId;

  const CreateBookingParams({
    required this.serviceId,
    required this.scheduledAt,
    required this.addressId,
  });

  @override
  List<Object> get props => [serviceId, scheduledAt, addressId];
}

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:dotech_customer/features/booking/domain/entities/booking.dart';
import 'package:dotech_customer/features/booking/domain/usecases/create_booking.dart';

import 'package:dotech_customer/features/booking/domain/usecases/get_booking_by_id.dart';

abstract class BookingEvent extends Equatable {
  const BookingEvent();
  @override
  List<Object?> get props => [];
}

class PlaceBookingEvent extends BookingEvent {
  final String serviceId;
  final DateTime scheduledAt;
  final String addressId;

  const PlaceBookingEvent({
    required this.serviceId,
    required this.scheduledAt,
    required this.addressId,
  });

  @override
  List<Object?> get props => [serviceId, scheduledAt, addressId];
}

class GetBookingDetailEvent extends BookingEvent {
    final String bookingId;
    const GetBookingDetailEvent(this.bookingId);
    @override
    List<Object?> get props => [bookingId];
}

abstract class BookingState extends Equatable {
  const BookingState();
  @override
  List<Object?> get props => [];
}

class BookingInitial extends BookingState {}

class BookingLoading extends BookingState {}

class BookingPlaced extends BookingState {
  final Booking booking;
  const BookingPlaced(this.booking);
  @override
  List<Object?> get props => [booking];
}

class BookingDetailLoaded extends BookingState {
    final Booking booking;
    const BookingDetailLoaded(this.booking);
    @override
    List<Object?> get props => [booking];
}

class BookingError extends BookingState {
  final String message;
  const BookingError(this.message);
  @override
  List<Object?> get props => [message];
}

class BookingBloc extends Bloc<BookingEvent, BookingState> {
  final CreateBooking createBookingUseCase;
  final GetBookingById? getBookingByIdUseCase;

  BookingBloc({
    required this.createBookingUseCase,
    this.getBookingByIdUseCase,
  }) : super(BookingInitial()) {
    on<PlaceBookingEvent>((event, emit) async {
      emit(BookingLoading());
      final result = await createBookingUseCase(
        CreateBookingParams(
          serviceId: event.serviceId,
          scheduledAt: event.scheduledAt,
          addressId: event.addressId,
        ),
      );
      result.fold(
        (failure) => emit(BookingError(failure.message)),
        (booking) => emit(BookingPlaced(booking)),
      );
    });

    on<GetBookingDetailEvent>((event, emit) async {
        if (getBookingByIdUseCase == null) {
            emit(const BookingError('Feature not configured'));
            return;
        }
        emit(BookingLoading());
        final result = await getBookingByIdUseCase!(event.bookingId);
        result.fold(
            (failure) => emit(BookingError(failure.message)),
            (booking) => emit(BookingDetailLoaded(booking)),
        );
    });
  }
}
